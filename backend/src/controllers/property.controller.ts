import { NextFunction, Request, Response } from "express";
import Property from "../models/property.model";
import ErrorHandler from "../utils/errorHandler";

export const createProperty = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const {name, location, description} = req.body;
    const createdBy = req.userId;

    const property = await Property.create({name, location, description, createdBy});
     res.status(200).json({
      success:true,
      property
    });

  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};

export const getAllProperties = async (_req: Request, res: Response, next:NextFunction) => {
  try {

    const properties = await Property.find();
    res.status(200).json({
      success:true,
      properties
    });

  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};

export const getPropertyById = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const property = await Property.findById(req.params.id);

    if(!property){
      return next(new ErrorHandler("No Property Found", 404));
    }
    res.status(200).json({
      success:true,
      property
    });
  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};

export const deleteProperty = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if(!property){
      return next(new ErrorHandler("No Property Found", 404));
    }

    res.status(200).json({
      success:true,
      message: "Property deleted"
    });

  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};