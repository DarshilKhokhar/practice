import { Body, Get, JsonController, Post, Res } from "routing-controllers";
import Container from "typedi";
import { IExtendedResponse } from "../../common/common-types";
import { SearchService } from "./search.service";
import { SearchPayload } from "./dto/search.dto";

@JsonController("/search")
export default class SearchController {
  protected _searchService: SearchService;

  constructor() {
    this._searchService = Container.get(SearchService);
  }

  // TO add Sorting Type
  @Post("/sorting", { transformRequest: true })
  async AddSortingType(
    @Res() res: IExtendedResponse,
    @Body() body: SearchPayload
  ) {
    try {
      const { value } = body.payload;

      // check if the Sorting type is already exists or not
      const query = {
          value,
        },
        type = await this._searchService.findOne(query, { _id: 1 });
      if (type)
        return res.formatter.error({}, false, "SORTING_TYPE_ALREADY_EXISTS!");

      // Save Sorting type in the DB
      const dataTosave = {
          value,
          type: "sorting",
        },
        sorting = await this._searchService.save(dataTosave);

      return res.formatter.ok(sorting, true, "SORTING_TYPE_SAVED");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "SORTING_TYPE_ADD_FAILURE",
        err as Error
      );
    }
  }

  // TO get list of Sorting types.
  @Get("/sorting", { transformRequest: true })
  async GetSortingType(@Res() res: IExtendedResponse) {
    try {
      const projection = {
          value: 1,
          type: 1,
        },
        sorting = await this._searchService.find(
          { type: "sorting" },
          projection,
          {}
        );

      return res.formatter.ok({ sorting }, true, "GET_SORTING_TYPE");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "GET_SORTING_TYPE_ERROR",
        err as Error
      );
    }
  }

  // TO add Filter Type
  @Post("/filter", { transformRequest: true })
  async AddFilterType(
    @Res() res: IExtendedResponse,
    @Body() body: SearchPayload
  ) {
    try {
      const { value } = body.payload;

      // check if the Filter type is already exists or not
      const query = {
          value,
        },
        type = await this._searchService.findOne(query, { _id: 1 });
      if (type)
        return res.formatter.error({}, false, "FILTER_TYPE_ALREADY_EXISTS!");

      // Save Filter type in the DB
      const dataTosave = {
          value,
          type: "filter",
        },
        sorting = await this._searchService.save(dataTosave);

      return res.formatter.ok(sorting, true, "FILTER_TYPE_SAVED");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "FILTER_TYPE_ADD_FAILURE",
        err as Error
      );
    }
  }

  // TO get list of Filter types.
  @Get("/filter", { transformRequest: true })
  async GetFilterType(@Res() res: IExtendedResponse) {
    try {
      const projection = {
          value: 1,
          type: 1,
        },
        sorting = await this._searchService.find(
          { type: "filter" },
          projection,
          {}
        );

      return res.formatter.ok({ sorting }, true, "GET_FILTER_TYPE");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "GET_FILTER_TYPE_ERROR",
        err as Error
      );
    }
  }
}
