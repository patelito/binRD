import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Description } from '../description/description';
import { DatabaseProvider } from '../../providers/database/database';

// Remove this when user is in local storage
const ACTUAL_USER = 1;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  posts: Object[];
  bookmarks: Number[];
  selectedPost: Number;

  constructor(public navCtrl: NavController, private databaseprovider: DatabaseProvider, public callNumber: CallNumber) {
    
    this.databaseprovider.getDatabaseState().subscribe( rdy => {
      if( rdy ) {
        // return postSearch ? postSearch :this.loadData()
        return this.loadData()
      }
    })
  }

  loadData() {
    this.databaseprovider.getAllPost().then( data=> {
      console.log("DATA: ", data);
      this.posts = [...data];
    })
  }

  // getPostsBookmarkers() {
  //   const idUser = ACTUAL_USER;
  //   this.databaseprovider.getBookmarks( idUser ).then( data => {
  //     this.bookmarks = [...data];
  //   })
  // }

  goToDescription( postId ) {
    console.log("POST SELECTED: ", postId)
    this.navCtrl.push(Description, { postId });
  }

  contactSeller(phone) {
    this.callNumber.callNumber(`${phone}`, true);
  }
}
