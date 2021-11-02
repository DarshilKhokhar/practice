import { Application } from "express";
import { useExpressServer } from "routing-controllers";
import FileUploadController from "./api/fileUpload/fileUpload.controller";
import CookieMonsterController from "./api/cookieMonster/cookieMonster.controller";
import FoodTypeController from "./api/foodType/foodType.controller";
import MealTypeController from "./api/mealType/mealType.controller";
import RestaurantController from "./api/restaurant/restaurant.controller";
import MenuCategoryController from "./api/menuCategory/menuCategory.controller";
import MenuItemController from "./api/menuItem/menuItem.controller";
import FavourireRestaurantController from "./api/favouriteRestaurant/favouriteRestaurant.controller";
import CartController from "./api/cart/cart.controller";
import HomeBannerController from "./api/homeBanner/homeBanner.controller";
import SearchController from "./api/search/search.controller";
import OrderController from "./api/order/order.controller";
import CookieMakerController from "./api/cookieMaker/cookieMaker.controller";
import ContactUsController from "./api/contactUs/contactUs.controller";
import NotificationController from "./api/notification/notification.controller";
import ReviewController from "./api/review/review.controller";

const basePath = '/api/v1';
function initRoute(app: Application) {
  useExpressServer(app, {
    controllers: [
      CookieMonsterController,
      CookieMakerController,
      MealTypeController,
      FoodTypeController,
      RestaurantController,
      MenuCategoryController,
      FavourireRestaurantController,
      SearchController,
      NotificationController,
      ContactUsController,
      HomeBannerController,
      CartController,
      OrderController,
      MenuItemController,
      FileUploadController,
      ReviewController
    ],
    defaultErrorHandler: true,
    routePrefix: basePath
  });
}

export default initRoute;