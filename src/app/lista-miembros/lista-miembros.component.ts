import { Component } from '@angular/core';
import { MiembrosService } from '../services/miembros.service';
import Miembro from '../interfaces/miembro.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-miembros',
  templateUrl: './lista-miembros.component.html',
  styleUrls: ['./lista-miembros.component.css']
})
export class ListaMiembrosComponent {
  miembros: any[] = [
    { cedula: '123456789', nombre: 'John', apellido: 'Doe', genero: 'masculino', fechaNacimiento: '1990-01-01', foto: '' },
    { cedula: '987654321', nombre: 'Jane', apellido: 'Doe', genero: 'femenino', fechaNacimiento: '1992-05-10', foto: '' },
    // Agrega más miembros aquí si es necesario
  ];
  constructor(private miembrosService: MiembrosService){}

  ngOnInit(){
    this.miembrosService.getMiembros().subscribe(miembros => {
      console.log(miembros);
      this.miembros = miembros;
    })
  }

  async onClickDelete(miembro: Miembro){


    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminará el miembro',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        
    const response = await this.miembrosService.deleteMiembros(miembro);
    if(response != null){
      console.log(response);
    }
        console.log('Operación de eliminación confirmada');
      } else {
        // Código a ejecutar cuando se hace clic en "Cancelar" o se cierra el cuadro de diálogo
        console.log('Operación de eliminación cancelada');
      }
    });
  }

 


}
