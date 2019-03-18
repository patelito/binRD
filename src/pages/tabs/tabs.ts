import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { SearchPage } from '../search/search';
import { AddPage } from '../add/add';
import { BookmarksPage } from '../bookmarks/bookmarks';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabHomeRoot = HomePage;
  tabSearchRoot = SearchPage;
  tabAddRoot = AddPage;
  tabBookmarksRoot = HomePage;
  tabProfileRoot = ProfilePage;

  constructor() {

  }
}