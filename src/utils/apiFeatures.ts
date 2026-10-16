import { Query } from "mongoose";
import { ParsedQs } from "qs";

export class APIFeatures {
    public page = 1;
    public limit = 10;
    constructor(public query: Query<any, any>,
        public queryString: ParsedQs) { }
    
    // Filtering
    filter() { 
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${ match }`);
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
         if (this.queryString.sort) { 
            const sortBy = (this.queryString.sort as string).split(',').join(' ');
            console.log('sort by',sortBy);
            this.query = this.query.sort(sortBy);
        }else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() { 
        if (this.queryString.fields) {
            const fields = (this.queryString.fields as string).split(',').join(' ');
            console.log('fields',fields);
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        this.page = parseInt(this.queryString.page as string) || 1;
        this.limit = parseInt(this.queryString.limit as string) || 10;

        const skip = (this.page - 1) * this.limit;

        this.query = this.query.skip(skip).limit(this.limit);

        return this;
    }
}