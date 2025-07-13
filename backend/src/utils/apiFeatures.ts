import { Document, FilterQuery, Query } from "mongoose";
import { IProduct } from "../models/product.model";

interface QueryString {
  keyword?: string;
  page?: string;
  limit?: string;
  [key: string]: any;
}

class ApiFeatures {
  public query: any;
  public queryStr: QueryString;

  constructor(query: any, queryStr: QueryString) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    const parsedFilter: FilterQuery<IProduct> = JSON.parse(queryStr);
    this.query = this.query.find(parsedFilter);

    return this;
  }

  pagination(resultPerPage: number) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

export default ApiFeatures;
