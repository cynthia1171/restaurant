import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Restaurante } from '../../clases/restaurante';
import { SocialSharing } from '@ionic-native/social-sharing';
import { RestauranteService } from '../../servicios/restaurante.service';

@IonicPage()
@Component({
  selector: 'page-restaurant',
  templateUrl: 'restaurant.html',
})
export class RestaurantPage {
  restaurante: Restaurante;
  rid: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private socialSharing: SocialSharing,
              public restauranteService: RestauranteService) {
    this.restaurante = navParams.get('restaurante');
    this.rid = navParams.get('rid');        
  }

  cerrar() {
    this.viewCtrl.dismiss();
  }

  borrar() {
    this.restauranteService.borrarRestaurante(this.rid);
    this.cerrar();
  }

  compratirWhatsapp() {
    let mensaje = this.restaurante.nombre;
    let url = "http://www.google.com/maps/@" + this.restaurante.ubicacion.lat + "," + this.restaurante.ubicacion.lng + ",13z?hl=es";
    this.socialSharing.shareViaWhatsApp(mensaje, this.restaurante.imagenes[0], url);
  }
}
