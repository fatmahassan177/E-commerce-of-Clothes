import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { IProduct,IProductsRes } from "../Interfaces/product-interface"; 
import { ProductService } from "../services/product-service";
import { catchError, of } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn:"root"
})
export class ProductResolver implements Resolve<IProductsRes | null>{
    constructor(private _router:Router,private _productS:ProductService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<IProductsRes | RedirectCommand | null> {
        
        const productRoute=route.paramMap.get('route')
        if(productRoute){
            return this._productS.getProductByRoute(productRoute).pipe(catchError(err=>{
                this._router.navigate(['/products'])
                 return of(null)   ///===>value not observe=>observ
                
            }))
        }
         this._router.navigate(['/products'])
                 return of(null)   
    }
}