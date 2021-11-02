import {
  Body,
  Get,
  JsonController,
  Post,
  Res,
  Param,
  Put,
  QueryParams,
  UseBefore,
  Req,
  BodyParam,
  Delete,
} from "routing-controllers";
import mongoose from "mongoose";
import Container from "typedi";
import { IExtendedRequest, IExtendedResponse } from "../../common/common-types";
import { RestaurantService } from "./restaurant.service";
import { RestaurantPayload } from "./dto/restaurant.dto";
import { RestaurantUpdatePayload } from "./dto/restaurantUpdate.dto";
import { MenuCategoryService } from "../menuCategory/menuCategory.service";
import { RestaurantParams } from "./dto/restaurantParams.dto";
import { FavouriteRestaurantService } from "../favouriteRestaurant/favouriteRestaurant.service";
import { restaurantOffers } from "./dto/restaurantOffers.dto";
import { CookieMakerValidator } from "../../middleware/cookieMakerValidator";
import { CookieMakerService } from "../cookieMaker/cookieMaker.service";
import { query } from "express";
import { MenuItemService } from "../menuItem/menuItem.service";

@JsonController("")
export default class RestaurantController {
  protected _restaurantService: RestaurantService;
  protected _menuCategoryService: MenuCategoryService;
  protected _favouriteRestaurantService: FavouriteRestaurantService;
  protected _cookieMakerService: CookieMakerService;
  protected _menuItemService: MenuItemService

  constructor() {
    this._restaurantService = Container.get(RestaurantService);
    this._menuCategoryService = Container.get(MenuCategoryService);
    this._favouriteRestaurantService = Container.get(
      FavouriteRestaurantService
    );
    this._cookieMakerService = Container.get(CookieMakerService);
    this._menuItemService = Container.get(MenuItemService);
  }

  // TO add Resturant Details.
  @Post("/cookie-maker/restaurant", { transformRequest: true })
  @UseBefore(CookieMakerValidator)
  async AddRestaurant(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Body() body: RestaurantPayload
  ) {
    try {
      const restaurantId = req.context?.user.restaurantId;
      if (restaurantId)
        return res.formatter.error({}, false, "RESTAURANT_ALREADY_ADDED");
      const {
          name,
          logo,
          bannerImage,
          phoneNumber,
          minOrderValue,
          maxOrderValue,
          deliveryCharge,
          openingTime,
          closingTime,
          deliveryTime,
          lastOrderTime,
          address,
          foodType,
          deliveryType,
        } = body.payload,
        cookieMakerId = req.context?.user._id;

      // Save Restaurant Data in the Database.
      const dataTosave = {
          name,
          logo,
          bannerImage,
          phoneNumber,
          minOrderValue,
          maxOrderValue,
          deliveryCharge,
          openingTime,
          closingTime,
          deliveryTime,
          lastOrderTime,
          address,
          foodType,
          deliveryType,
        },
        restaurant = await this._restaurantService.save(dataTosave);

      const cookieMakerDetails =
        await this._cookieMakerService.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(cookieMakerId) },
          { $set: { restaurantId: restaurant._id } }
        );

      return res.formatter.ok({ restaurant }, true, "RESTAURANT_DATA_SAVED");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "RESTAURANT_ADD_FAILURE",
        err as Error
      );
    }
  }

  // TO add Offer Details.
  @Post("/cookie-maker/restaurant/offers", { transformRequest: true })
  @UseBefore(CookieMakerValidator)
  async AddOffers(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Body() body: restaurantOffers
  ) {
    try {
      const offers = body.offer,
        restaurantId = req.context?.user.restaurantId;

      // Save Offer Data in the Database.
      const dataTosave = {
        offers,
      };
      await this._restaurantService.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(restaurantId) },
        { $push: dataTosave },
        {
          lean: true,
        }
      );

      return res.formatter.ok({ offerSaved: true }, true, "OFFER_SAVED");
    } catch (err) {
      return res.formatter.error({}, false, "ADD_OFFER_FAILURE", err as Error);
    }
  }

  // To update the status of offer
  @Put("/cookie-maker/restaurant/offers/:id")
  @UseBefore(CookieMakerValidator)
  async UpdateStatus(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @BodyParam("status") status: string,
    @Param("id") id: string
  ) {
    try {
      const restaurantId = req.context?.user.restaurantId,
        query = {
          _id: mongoose.Types.ObjectId(restaurantId),
          "offer._id": mongoose.Types.ObjectId(id),
        },
        updatedStatus = await this._restaurantService.updateOne(query, {
          $set: {
            "offer.$.status": status,
          },
        });
      return res.formatter.ok(updatedStatus, true, "UPDATED_OFFER_STATUS!");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  // TO Delete Offer
  @Delete("/cookie-maker/restaurant/offers/:id")
  @UseBefore(CookieMakerValidator)
  async DeleteOffer(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Param("id") id: string
  ) {
    try {
      const restaurantId = req.context?.user.restaurantId,
        query = {
          _id: mongoose.Types.ObjectId(restaurantId),
          "offer._id": mongoose.Types.ObjectId(id),
        },
        DeletedOffer = await this._restaurantService.updateOne(query, {
          $pull: { offers: { _id: mongoose.Types.ObjectId(id) } },
        });
      return res.formatter.ok(DeletedOffer, true, "DELETED_OOFER!");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  // TO Get Offer Details.
  @Get("/cookie-maker/restaurant/offers", { transformRequest: true })
  @UseBefore(CookieMakerValidator)
  async ListOffers(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse
  ) {
    try {
      const restaurantId = req.context?.user.restaurantId;

      // Find the list of offers
      const restaurantOffers = await this._restaurantService.find(
        { _id: mongoose.Types.ObjectId(restaurantId) },
        { offer: 1 }
      );

      return res.formatter.ok(restaurantOffers, true, "OFFER_SAVED");
    } catch (err) {
      return res.formatter.error({}, false, "LISt_OFFER_FAILURE", err as Error);
    }
  }

  // Fetch list of restaurants. By Default we are fetching Active Restaurants. To fetch inactive restaurants, add isActive: 0 in query parameter. Query Parameter mealTypeId is optional, if you pass: it will filter restaurants based on Meal Type.
  @Get("/restaurant", { transformRequest: true })
  async GetRestaurant(
    @Res() res: IExtendedResponse,
    @QueryParams() params: RestaurantParams
  ) {
    try {
      const projection = {
        name: 1,
        logo: 1,
        avgRatings: 1,
        foodType: 1,
        deliveryTime: 1,
        isActive: 1,
        offer: 1,
        deliveryType: 1,
      };
      let query: { [key: string]: any } = {
        isActive: 1,
      };
      if (params.long && params.latt) {
        query = {
          isActive: 1,
          "address.location": {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [params.long, params.latt],
              },
              $maxDistance: 5000,
            },
          },
        };
      }
      if (params.mealTypeId) {
        query = {
          offeredMealType: {
            $elemMatch: { $eq: mongoose.Types.ObjectId(params.mealTypeId) },
          },
        };
      }
      if (params.search) {
        query = {
          $or: [
            { name: { $regex: params.search, $options: "i" } },
            { description: { $regex: params.search, $options: "i" } },
          ],
        };
      }
      if (params.isActive === 0) {
        query.isActive = 0;
      }
      const restaurant = await this._restaurantService.find(query, projection),
        count = restaurant.length;
      if (count === 0)
        return res.formatter.error({}, false, "RESTAURANT_NOT_FOUND!");

      return res.formatter.ok({ count, restaurant }, true, "GET_RESTAURANT");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "GET_RESTAURANT_ERROR",
        err as Error
      );
    }
  }

  // Sort Restaurant Based on Fields
  @Get("/restaurant/sort", { transformRequest: true })
  async getRestaurantAscending(    @Res() res: IExtendedResponse,    @QueryParams() params: RestaurantParams  ){
    try{
      let pipeLine:any[] = [];
      if(params.OrderBy === "A-to-Z"){
        pipeLine = [
          { 
            "$sort": {
                "name": 1
            }
          }
        ]
      }
      if(params.OrderBy === "Z-to-A"){
        pipeLine = [
          { 
            "$sort": {
                "name": -1
            }
          }
        ]
      }
      if(params.OrderBy === "top-rated"){
        pipeLine = [
          { 
            "$sort": {
                "avgRatings": -1
            }
          }
        ]
      }
      const restaurant = await this._restaurantService.aggregate(pipeLine);
      if(!restaurant)
        return res.formatter.error({}, false, "RESTAURANT_NOT_FOUND!");
    
      return res.formatter.ok({ restaurant }, true, "GET_RESTAURANT");
    }
    catch(err){
      return res.formatter.error(
        {},
        false,
        "GET_RESTAURANT_ERROR",
        err as Error
      );
    }
  }

  // Fliter Restaurant Based on Fields
  @Get("/restaurant/filter", { transformRequest: true })
  async GetRestaurantFilter(
    @Res() res: IExtendedResponse,
    @QueryParams() params: RestaurantParams
  ){
    try{

      let restaurants = await this._restaurantService.find({}, {});
      
      if(!restaurants)
        return res.formatter.error({}, false, "RESTAURANT_NOT_FOUND!");

      if(params.FD === "FD"){
        restaurants = await this._restaurantService.find({ deliveryCharge: { $exists: true, $in: [0] } }, {})
      }

      if(params.minOrder === "minOrder"){
        restaurants = await this._restaurantService.find({ minOrderValue: { $exists: true, $in: [0] } }, {})
      }

      if(params.new === "new"){
        const pipeLine = [
          { 
            "$sort": { 
              "createdAt": -1
            } 
          }
        ];
        restaurants = await this._restaurantService.aggregate(pipeLine)
      }

      if(params.open === "open"){
        restaurants = await this._restaurantService.find({ isActive: { $exists: true, $in: [1] } }, {})
      }

      
      return res.formatter.ok({ restaurants }, true, "GET_RESTAURANT");
      
    }
    catch(err){
      return res.formatter.error(
        {},
        false,
        "GET_RESTAURANT_ERROR",
        err as Error
      );
    }
  }


  
  // TO fetch details of particular Resturant.
  @Get("/restaurant/:id")
  async getOneRestaurant(
    @Res() res: IExtendedResponse,
    @Param("id") id: string
  ) {
    try {
      const projection = {
          name: 1,
          logo: 1,
          bannerImage: 1,
          avgRatings: 1,
          foodType: 1,
          offer: 1,
          deliveryTime: 1,
          isActive: 1,
          deliveryType: 1,
        },
        restaurant = await this._restaurantService.findOne(
          { _id: mongoose.Types.ObjectId(id) },
          projection,
          {}
        );

      if (!restaurant)
        return res.formatter.error({}, false, "RESTAURANT_NOT_FOUND");

      const category = await this._menuCategoryService.find(
          { restaurantId: mongoose.Types.ObjectId(id) },
          { categoryName: 1 }
        ),
        isFavouritRestaurant = await this._favouriteRestaurantService.findOne(
          { restaurantId: mongoose.Types.ObjectId(id) },
          {}
        );

      let isFavourited = false;

      if (isFavouritRestaurant) {
        isFavourited = true;
      }

      return res.formatter.ok(
        { restaurant, category, favourited: isFavourited },
        true,
        "GET_SINGLE_RESTAURANT"
      );
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "GET_RESTAURANT_ERROR",
        err as Error
      );
    }
  }

  // TO get expected delivery time for restaurant.
  @Get("/restaurant/:id/delivery-time")
  async GetEstimateDeliveryTime(
    @Res() res: IExtendedResponse,
    @Param("id") id: string
  ) {
    try {
      const restaurant = await this._restaurantService.findOne(
        { _id: mongoose.Types.ObjectId(id) },
        { deliveryTime: 1 },
        {}
      );

      if (!restaurant)
        return res.formatter.error({}, false, "RESTAURANT_NOT_FOUND");

      return res.formatter.ok(
        { restaurant },
        true,
        "GET_ESTIMATE_DELIVERY_TIME_OF_RESTAURANT"
      );
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "GET_ESTIMATE_DELIVERY_TIME_OF_RESTAURANT_ERROR",
        err as Error
      );
    }
  }

  // TO Update restaurant Details.
  @Put("/cookie-maker/restaurant")
  @UseBefore(CookieMakerValidator)
  async EditRestaurant(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Body() body: RestaurantUpdatePayload
  ) {
    try {
      const dataToUpdate = body.payload,
        restaurantId = req.context?.user.restaurantId,
        restaurant = await this._restaurantService.findByIdAndUpdate(
          {_id: mongoose.Types.ObjectId(restaurantId)},
          { $set: dataToUpdate },
          {
            new: true,
          }
        );
      if (!restaurant)
        return res.formatter.error({}, false, "RESTAURANT_NOT_FOUND");
      return res.formatter.ok({ restaurant }, true, "UPDATE_RESTAURANT_DATA");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "UPDATE_RESTAURANT_DATA_ERROR",
        err as Error
      );
    }
  }
}
