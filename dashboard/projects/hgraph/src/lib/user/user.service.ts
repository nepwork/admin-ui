
import { UserStream } from './../model/model.stream';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: UserStream;

  constructor() { }

  set user(user: UserStream) {
    this.user = user;
  }

  get user(): UserStream {
    return this.user;
  }
}
