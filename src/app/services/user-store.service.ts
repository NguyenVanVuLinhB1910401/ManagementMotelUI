import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private userName$ = new BehaviorSubject<string>("");
  private roles$ = new BehaviorSubject<any>("");
  constructor() { }
  public getRolesFromStore(){
    return this.roles$.asObservable();
  }
  public setRolesForStore(roles: any){
    this.roles$.next(roles);
  }
  public getUserNameFromStore(){
    return this.userName$.asObservable();
  }
  public setUserNameForStore(userName: string){
    this.userName$.next(userName);
  }
}
