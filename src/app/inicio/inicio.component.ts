import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from '@angular/fire/storage';
import { MiembrosService } from '../services/miembros.service';
import Miembro from '../interfaces/miembro.interface';

import { ActivatedRoute } from '@angular/router';

declare const faceapi: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  allowToggle: boolean = true;
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('imageElement') imageElement!: ElementRef;
  nombres: string[] = [''];

  miembros: any = [
    {
      nombre: 'Andres',
      apellido: 'Moreta',
      asistencia: false,
    },
    {
      nombre: 'Todd',
      apellido: 'Howard',
      asistencia: false,
    },
    // Agrega más miembros aquí si es necesario
  ];
  // asistenciaLista: any = {nombre:"", asistencia:false}

  constructor(
    private route: ActivatedRoute,
    private storage: Storage,
    private miembrosService: MiembrosService
  ) {}

  ngOnInit() {
    const miembrosTmp: any = [];
    const state = history.state;
    if (state && state.miembros) {
      const miembros = state.miembros;
      this.nombres = miembros;
      miembros.forEach((miembro: any) => {
        miembrosTmp.push({ nombre: miembro, asistencia: false });
      });
      this.miembros = miembrosTmp;
      // Hacer lo necesario con el array de miembros recibido
      console.log(miembros);
    }
    this.cargarModelos();

    /* Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models')
    ]).then(() => {
      this.initializeCamera();
    });
*/
  }
  toggleAsistencia(miembro: any) {
    miembro.asistencia = true;
    /* if (this.allowToggle) {
    }
   // miembro.asistencia = !miembro.asistencia;
   this.allowToggle = false;
   */
  }

  async cargarModelos() {
    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
      ]);

      this.initializeCamera();
    } catch (error) {
      console.error('Error al cargar modelos o inicializar cámara:', error);
    }
  }

  async loadModel() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    //  this.detectFaces();
  }

  detectFaces() {
    const image = this.imageElement.nativeElement;
    faceapi.detectAllFaces(image).then((faces: any[]) => {
      console.log('Número de caras detectadas:', faces.length);
    });
  }

  initializeCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.videoElement.nativeElement.srcObject = stream;
        })
        .catch((error) => {
          console.log('Error al acceder a la cámara: ', error);
        });
    }
  }
  async getLabeledFaceDescriptions() {
    //const labels: string[] = [];
    const labels = this.nombres;
    /*
   this.miembros.forEach((miembro: any) => {
     // Accede a las propiedades del miembro
     labels.push(`${miembro.nombre}-${miembro.apellido}`);
     console.log(labels);
    });
     console.log(labels);
    this.miembrosService.getMiembros().subscribe(miembros => {
      miembros.forEach(miembro => {
        labels.push(`${miembro.nombre}-${miembro.apellido}`);
      });
      console.log(labels);
    });*/
    //const labels = this.nombres;
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 1; i++) {
          const imagesRef = ref(this.storage, `images/${label}/`);
          const response = await listAll(imagesRef);
          const items = response.items;
          if (items.length > 0) {
            const item = items[0];
            const url = await getDownloadURL(item);

            console.log(url);
            const img = await faceapi.fetchImage(url);
            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            descriptions.push(detections.descriptor);
          }
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }

  ngAfterViewInit() {
    const video = this.videoElement.nativeElement;

    video.addEventListener('play', async () => {
      const labeledFaceDescriptors = await this.getLabeledFaceDescriptions();
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      const canvas = faceapi.createCanvasFromMedia(video);
      //document.body.append(canvas);
      const canvasContainer = document.getElementById('canvasContainer');
      canvasContainer!.appendChild(canvas);

      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video)
          .withFaceLandmarks()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        const results = resizedDetections.map((d: any) =>
          faceMatcher.findBestMatch(d.descriptor)
        );
        results.forEach((result: any, i: number) => {
          const box = resizedDetections[i].detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, { label: result });
          drawBox.draw(canvas);
          console.log(result._label);
          this.miembros.forEach((miembro: any) => {
            // Accede a las propiedades del miembro
            if (`${miembro.nombre}` === result._label) {
              this.toggleAsistencia(miembro);
            }
          });
        });
      }, 100);
    });

    this.startCamera();
  }

  startCamera() {
    this.initializeCamera();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageElement.nativeElement.src = e.target.result;
    };

    reader.readAsDataURL(file);
    this.detectFaces();
  }

  guardarAsistencia() {
    let asitencia: object = {};
    const fechaActual = new Date();

    let asistenciaT: object = { lista: this.miembros, fecha: fechaActual };

    this.miembrosService.addAsistencia(asistenciaT);
  }
}
