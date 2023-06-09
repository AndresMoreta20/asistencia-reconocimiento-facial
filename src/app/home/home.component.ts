import { Component } from '@angular/core';
import { MiembrosService } from '../services/miembros.service';
import { Router } from '@angular/router';

import {
  Storage,
  
} from '@angular/fire/storage';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  miembros: string[]= [
  ];

  constructor( private router: Router, private storage: Storage,
    private miembrosService: MiembrosService){}
  ngOnInit(){
    this.miembrosService.getMiembros().subscribe(miembros => {
      miembros.forEach(miembro => {
        this.miembros.push(`${miembro.nombre}-${miembro.apellido}`);
      });
      console.log(this.miembros);
    })
  }
  navegarAOtroComponente() {
    this.router.navigate(['inicio'], { state: { miembros: this.miembros } });
  }
  
}
