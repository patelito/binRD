import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-description',
  templateUrl: 'description.html'
})
export class Description {

  selectedMedia: object[];
  constructor(public navCtrl: NavController) {
    this.selectedMedia = [
      { thumbnail: 'https://st.motortrend.com/uploads/sites/5/2016/10/2016-Tesla-Model-S-60-front-three-quarter-in-motion-02-e1477952073682.jpg'},
      { thumbnail: 'https://www.tesla.com/content/dam/tesla-site/sx-redesign/img/models/footer/models@2.jpg'},
      { thumbnail: 'https://www.carzone.ie/reviews/images/591_ev4.JPG'},
      { thumbnail: 'https://www.carzone.ie/reviews/images/591_ev4.JPG'},
      { thumbnail: 'https://www.carzone.ie/reviews/images/591_ev4.JPG'}
    ]
  }

}
