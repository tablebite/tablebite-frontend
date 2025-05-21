import { commonAPI } from "./commonApi";

 export const getMenuListByRestaurantIdAndRestaurantName = async(restaurantId,restaurantName,headers) => {
    return await commonAPI("GET",`/api/v1/menus?restaurantId=${restaurantId}&restaurantName=${restaurantName}`,"",headers)
 }

 export const getMenuList = async(headers) => {
   return await commonAPI("GET",`/api/v1/menus`,"",null)
}
 
 export const getRestaurantList = async(headers) => {
   return await commonAPI("GET",`/api/v1/restaurants`,"",headers)
}

export const getRestaurantColorTheme = async(restaurantId,headers) => {
   return await commonAPI("GET",`/api/v1/restaurants/theme/${restaurantId}`,"",headers)
}

 export const addMenus = async(body,headers) => {
   return await commonAPI("POST",`/api/v1/menus`,body,headers)
}

export const addRestaurants = async(body,headers) => {
   return await commonAPI("POST",`/api/v1/restaurants`,body,headers)
}

export const updateMenuItem = async(body,headers )=> {
   return await commonAPI("PATCH",`/api/v1/menus`,body,headers)
}

export const updateRestaurants = async(body,headers )=> {
   return await commonAPI("PATCH",`/api/v1/restaurants`,body,headers)
}
