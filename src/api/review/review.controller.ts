import {
  Body,
  Get,
  JsonController,
  Post,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import Container from "typedi";
import { IExtendedRequest, IExtendedResponse } from "../../common/common-types";
import { CookieMakerValidator } from "../../middleware/cookieMakerValidator";
import { CookieUserValidator } from "../../middleware/cookieUserValidator";
import { ReviewPayload } from "./dto/review.dto";
import { ReviewService } from "./review.service";

@JsonController("")
export default class ReviewController {
  protected _reviewService: ReviewService;

  constructor() {
    this._reviewService = Container.get(ReviewService);
  }

  //To Add Rate & Review
  @Post("/review", { transformRequest: true })
  @UseBefore(CookieUserValidator)
  async addReview(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Body() body: ReviewPayload
  ) {
    try {
      const cookieMonsterId = req.context?.user._id;

      const { restaurantId, rating, reviewComment } = body.payload;

      const dataToSave = {
        cookieMonsterId,
        restaurantId,
        rating,
        reviewComment,
        reviewDate: new Date(Date.now()),
      };

      const review = await this._reviewService.save(dataToSave);

      return res.formatter.ok({ review }, true, "ADD_REVIEW");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  //To Get Rating & Reviews
  @Get("/cookie-maker/review", { transformRequest: true })
  @UseBefore(CookieMakerValidator)
  async GetReview(@Req() req: IExtendedRequest, @Res() res: IExtendedResponse) {
    try {
      const restaurantId = req.context?.user.restaurantId;
      let query: { [key: string]: any } = {
        restaurantId: restaurantId,
      };

      const reviews = await this._reviewService.find(query, {});

      let totalReviews = reviews.length;

      const projection = {
          reviewDate: 1,
          rating: 1,
          reviewComment: 1,
          cookieMonsterId: 1,
        },
        QueryOptions = {
          lean: true,
          sort: { reviews: -1 },
          limit: 5,
          populate: { path: "cookieMonsterId", select: "firstName" },
        },
        review = await this._reviewService.findPopular(
          query,
          projection,
          QueryOptions
        );

      let averageRatings = 0,
        Ratings = 0,
        awesome = 0,
        good = 0,
        meh = 0,
        bad = 0,
        terrible = 0;
      for (let i = 0; i < reviews.length; i++) {
        Ratings = Ratings + reviews[i].rating;
        averageRatings = Ratings / reviews.length;
        if (reviews[i].rating === 5) {
          awesome++;
        }
        if (reviews[i].rating === 4) {
          good++;
        }
        if (reviews[i].rating === 3) {
          meh++;
        }
        if (reviews[i].rating === 2) {
          bad++;
        }
        if (reviews[i].rating === 1) {
          terrible++;
        }
      }

      averageRatings = Math.ceil(averageRatings);
      const Reviews = {
          totalReviews,
          review,
        },
        Rating = {
          averageRatings,
          awesome,
          good,
          meh,
          bad,
          terrible,
        };

      return res.formatter.ok({ Rating, Reviews }, true, "RATING_AND_REVIEWS");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }
}
