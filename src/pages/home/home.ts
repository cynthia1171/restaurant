import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddRestaurantPage } from '../add-restaurant/add-restaurant';
import { Restaurante } from '../../clases/restaurante';
import { RestauranteService } from '../../servicios/restaurante.service';
import { RestaurantPage } from '../restaurant/restaurant';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  addRestaurantPage = AddRestaurantPage;
  restaurantes: Restaurante[] = [];

  constructor(public navCtrl: NavController, 
              public restauranteService: RestauranteService,
              public modalCtrl: ModalController) {

  }

  ngOnInit() {
    this.restauranteService.inicializarRestaurantes()
                           .then((restaurantes: Restaurante[]) => {
                              this.restaurantes = restaurantes;
                           })
                           .catch(error => {console.log(error)})
  }

  //lo primero que se cargara es la lista de restaurantes
  ionViewWillEnter() {
    this.restaurantes = this.restauranteService.cargarRestaurantes();
  }

  mostrarRestaurante(restaurante: Restaurante, rid: number) {
    let modal = this.modalCtrl.create(RestaurantPage, {restaurante: restaurante, rid: rid});
    modal.present();
    modal.onDidDismiss(() => {
      this.restaurantes = this.restauranteService.cargarRestaurantes();
    })
  }

}
