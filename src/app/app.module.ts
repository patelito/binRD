import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SearchPage } from '../pages/search/search';
import { AddPage } from '../pages/add/add';
import { BookmarksPage } from '../pages/bookmarks/bookmarks';
import { ProfilePage } from '../pages/profile/profile';
import { Description } from '../pages/description/description';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SearchPage,
    AddPage,
    BookmarksPage,
    ProfilePage,
    TabsPage,
    Description
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SearchPage,
    AddPage,
    BookmarksPage,
    ProfilePage,
    TabsPage,
    Description
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
