import { catelogAPI } from "./catelogApi";
import { organizationApi } from "./organizationApi";

 export const getMenuListByRestaurantIdAndRestaurantName = async(restaurantId) => {
    return await catelogAPI("GET",`/api/v1/items/restaurant/${restaurantId}`)
 }

 
 export const getCategoriesByRestaurantId = async(restaurantId) => {
    return await catelogAPI("GET",`/api/v1/categories/restaurant/${restaurantId}`)
 }


 export const getMenuList = async(headers) => {
   return await catelogAPI()
}
 
 export const getRestaurantList = async(headers) => {
   return await catelogAPI()
}

export const getRestaurantColorTheme = async(restaurantId,headers) => {
   return await catelogAPI()
}

 export const addMenus = async(body,headers) => {
   return await catelogAPI()
}

export const addRestaurants = async(body,headers) => {
   return await catelogAPI()
}

export const updateMenuItem = async(body,headers )=> {
   return await catelogAPI()
}

export const updateRestaurants = async(body,headers )=> {
   return await catelogAPI()
}

export const getRestaurantByRestaurantId = async(restaurantId)=> {
   return await organizationApi("GET",`/api/v1/organizations/id/${restaurantId}`)
}