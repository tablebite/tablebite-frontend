import { catelogAPI } from "./catelogApi";
import { catelogAdminAPI } from "./catelogAdminApi";
import { organizationApi } from "./organizationApi";

 export const getMenuListByRestaurantIdAndRestaurantName = async(restaurantId) => {
    return await catelogAPI("GET",`/api/v1/items/restaurant/${restaurantId}`)
 }

 
 export const getCategoriesByRestaurantId = async(restaurantId) => {
    return await catelogAPI("GET",`/api/v1/categories/restaurant/${restaurantId}`)
 }


export const getRestaurantByRestaurantId = async(restaurantId)=> {
   return await organizationApi("GET",`/api/v1/organizations/id/${restaurantId}`)
}

//admin api
export const getAllItemsByRestaurantId = async (
  restaurantId,
  page = 0,
  size = 10,
  sortBy = 'externalId',
  sortDirection = 'asc'
) => {
  const params = new URLSearchParams({
    restaurantId,
    page,
    size,
    sortBy,
    sortDirection,
  }).toString();

  return catelogAdminAPI('GET', `/admin/api/v1/items?${params}`);
};

//admin api
export const toggleItemStatus = async (restaurantId, itemId) => {
  const params = new URLSearchParams({
    restaurantId,
    itemId,
  }).toString();

  return catelogAdminAPI(
    'PATCH',
    `/admin/api/v1/items/status?${params}`
  );
};

