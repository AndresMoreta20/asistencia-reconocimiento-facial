import { Component} from '@angular/core';
import { MiembrosService } from '../services/miembros.service';
import Swal from 'sweetalert2';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage'

@Component({
  selector: 'app-crear-miembro',
  templateUrl: './crear-miembro.component.html',
  styleUrls: ['./crear-miembro.component.css']
})
export class CrearMiembroComponent {
  ocultarBoton: boolean = true;
  ocultarImagen: boolean = true;

  constructor(private miembrosService: MiembrosService, private storage: Storage){}

  datos:any = {
    cedula: '',
    nombre: '',
    apellido: '',
    genero: '',
    fechaNacimiento: '',
    foto: ''
  };

  async guardarDatos() {
    // Aquí puedes agregar la lógica para guardar los datos
  //  console.log(this.datos);
  this.ocultarBoton = true;
    const response = await this.miembrosService.addMiembro(this.datos);
    if(response != null){
      console.log(response);
      Swal.fire({
        title: 'Alerta',
        text: 'Se agregó un nuevo miembro',
        icon: 'info',
        confirmButtonText: 'Cerrar'
      })
      this.datos.cedula = '';
      this.datos.nombre = '';
      this.datos.apellido = '';
      this.datos.genero = '';
      this.datos.fechaNacimiento = '';
      this.datos.foto = '';
      this.ocultarBoton = false;
    }
    
  }

  cargarFoto(event: any) {
    const file = event.target.files[0];
    // Aquí puedes agregar la lógica para cargar la foto
    console.log(file);

    const imgRef = ref(this.storage, `images/${this.datos.nombre}-${this.datos.apellido}/1`)
    
    uploadBytes(imgRef, file)
    .then(response => {console.log(response);
      this.getImages();})
    .catch(error=>console.log(error));

    
    
  }


  getImages(){
    const imagesRef = ref(this.storage, `images/${this.datos.nombre}-${this.datos.apellido}/`);
    listAll(imagesRef)
    .then(async response=>{
      console.log(response);

      for(let item of response.items){
        const url = await getDownloadURL(item);
        console.log(url);
        if(url != ""){
          this.datos.foto = url;
          this.ocultarBoton = false;

        }
      }

    })
    .catch(error => 
      console.log(error)
    );
  }

  mostrarImagen(){
    this.getImages();
  }
  ngOnInit(){
  //  this.ocultarImagen = true;
    //this.getImages();
  }
}
