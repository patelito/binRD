import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Injectable()
export class DatabaseProvider { 
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'bin.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.database = db;
        this.storage.get('database_filled').then(val => {
          if (val) {
            this.databaseReady.next(true);
          } else {
            this.fillDatabase();
          }
        });
      });
    });
  }

  fillDatabase() {
    this.http.get('assets/dbsetup.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.error(e));
      });
  }

  getCategories() {
    return this.database.executeSql("SELECT * FROM categories", []).then((data) => {
      let categories = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          categories.push({ name: data.rows.item(i).name, id: data.rows.item(i).id });
        }
      }
      return categories;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  addPost(title, description, price, categoryId, images) {
    let data = [title, description, price, categoryId, images[0]];
    return this.database.executeSql("INSERT INTO posts (name, description, price, categoryId, featuredImageData) VALUES (?, ?, ?, ?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  createUser(nombre, usuario, avatar, phone, password, email) {
    let data = [nombre, usuario, avatar, phone, password, email]
    return this.database.executeSql("INSERT INTO users (name, username, avatar, phone, password, email) VALUES (?, ?, ?, ?, ?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log("Error: ", err)
    });
  }

  getUser(email, username) {
    let data = [email, username]
    return this.database.executeSql("SELECT * FROM users WHERE email = ? OR username = ? ", data).then(data => {
      return data;
    }, err => {
      console.log("Error: ", err)
    });
  }

  validateUser(username, password) {
    let data = [username, password]
    return this.database.executeSql("SELECT * FROM users WHERE username = ? AND password = ? ", data).then(data => {
      if(data.rows.length > 0)
      {
        this.storage.set('userid', data.rows.item(0).id);
        return true
      }
      return "Usuario o contrasena incorrecto"
    }, err => {
      console.log("Error: ", err)
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}


/*CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR,
  username VARCHAR UNIQUE,
  avatar VARCHAR,
  phone VARCHAR,
  password VARCHAR,
  email VARCHAR
);*/
