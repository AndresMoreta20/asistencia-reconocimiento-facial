import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InicioComponent } from './inicio/inicio.component';
import { CrearMiembroComponent } from './crear-miembro/crear-miembro.component';
import { ListaMiembrosComponent } from './lista-miembros/lista-miembros.component';

const routes: Routes = [{
  path:'', component:HomeComponent
},
{
  path:'home', component:HomeComponent
}
,
{
  path:'inicio', component:InicioComponent
},
{
  path:'crear', component:CrearMiembroComponent
},
{
  path:'lista', component:ListaMiembrosComponent
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
