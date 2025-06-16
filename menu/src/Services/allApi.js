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

//admin api ; get all items without pagination
export const getAllMenusByRestaurantId = async(restaurantId)=> {
   const params = new URLSearchParams({
    restaurantId
  }).toString();
   return await catelogAdminAPI('GET', `/admin/api/v1/items/list?${params}`)
}

//admin api ; get all categories without pagination
export const getAllCategoriessByRestaurantId = async(restaurantId)=> {
   const params = new URLSearchParams({
    restaurantId
  }).toString();
   return await catelogAdminAPI('GET', `/admin/api/v1/categories/list?${params}`)
}

// admin api: edit single item
export const updateItemById = async (
  restaurantId,
  itemId,
  updateItemRequest
) => {
  const params = new URLSearchParams({ restaurantId }).toString();
  return await catelogAdminAPI(
    "PUT",
    `/admin/api/v1/items/id/${itemId}?${params}`,
    updateItemRequest
  );
};


// admin api: delete single item
export const deleteItemById = async (
  restaurantId,
  itemId
) => {
  const params = new URLSearchParams({ restaurantId }).toString();
  return await catelogAdminAPI(
    "DELETE",
    `/admin/api/v1/items/id/${itemId}?${params}`
  );
};


// admin api: add single item
export const addItem = async (
  addItemRequest
) => {
  return await catelogAdminAPI(
    "POST",
    `/admin/api/v1/items`,
    addItemRequest
  );
};
