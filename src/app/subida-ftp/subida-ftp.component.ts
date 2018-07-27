import { Component, OnInit } from '@angular/core';
import { UploadService } from '../_services/upload.service'
import { loginResponse, SendArchivo } from '../_models/index'


@Component({
  selector: 'app-subida-ftp',
  templateUrl: './subida-ftp.component.html',
  styleUrls: ['./subida-ftp.component.css']
})
export class SubidaFtpComponent implements OnInit {

  selectedFile: File = null;
  selectedFileName: string;
  alerta: boolean = false;
  success: boolean = false;
  errorEnvio: boolean = false;
  cargando: boolean = false;
  archivoYEmpleado: SendArchivo;
  currentUser: loginResponse;
  empleado: string;



  constructor(private uploadService: UploadService) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.empleado = this.currentUser.NOMBRE_EMP;
  }
  ngOnInit() {
  }



  onFileChanged(file: FileList) {
    this.success = false;
    this.selectedFile = file.item(0);
    this.selectedFileName = this.selectedFile.name;
  }

  subir() {

  

    if (this.selectedFileName.endsWith('.xlsx') || this.selectedFileName.endsWith('.csv')) {

      this.cargando = true;
      this.success = false;

      this.uploadService.upload(this.selectedFile, this.selectedFileName, this.empleado)
        .subscribe(data => {
          console.log(data);
          if(data == "ok"){
            this.cargando = false;
            this.success = true;
            setTimeout(() => {
              this.success = false;
            }, 2500);
            this.selectedFileName = "";
          }else{
            this.cargando = false;
            this.errorEnvio = true;
            setTimeout(() => {
              this.errorEnvio = false;
            }, 2500);
            this.selectedFileName = "";
          }
        }, error => {
          console.log(error);
          this.cargando = false;
          this.errorEnvio = true;
          setTimeout(() => {
            this.errorEnvio = false;
          }, 2500);
          this.selectedFileName = "";
          
         
        });


    } else {
      this.alerta = true;
      this.selectedFileName = "";
      setTimeout(() => {
        this.alerta = false;
      }, 2500);
    }

   

  
  }

}
