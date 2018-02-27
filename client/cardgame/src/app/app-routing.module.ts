import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { LibMaterialModule } from './lib-material.module';

import { EventBusService } from './event-bus/event-bus.service';
import { AuthenticationService } from './auth/authentication.service';
import { AuthGuard } from './auth/auth';
import { GameService } from './game-service/game.service';
import { CardsService } from './cards-service/cards.service';
import { UsersService } from './users-service/users.service';

import { LoginComponent } from './auth/login/login.component';
import { GoogleLoginButtonComponent } from './auth/google-login-button/google-login-button.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { CellComponent } from './cell/cell.component';
import { ConsoleComponent } from './console/console.component';
import { GameDocsComponent } from './game-docs/game-docs.component';
import { CardsComponent } from './cards/cards.component';
import { CardEditorComponent } from './card-editor/card-editor.component';
import { UsersComponent } from './users/users.component';
import { UserEditorComponent } from './user-editor/user-editor.component';


const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/rules', 
    pathMatch:'full'
  },{ 
    path: 'rules', 
    component: GameDocsComponent
  },{ 
    path: 'login', 
    component: LoginComponent,
    data: { 
      showNavigator: false
    }
  },{ 
    path: 'board', 
    component: GameBoardComponent,
    canActivate: [AuthGuard]
  },{ 
    path: 'deck', 
    component: GameBoardComponent,
    canActivate: [AuthGuard]
  },{ 
    path: 'battle', 
    component: GameBoardComponent,
    canActivate: [AuthGuard]
  },{ 
    path: 'cards', 
    component: CardsComponent,
    canActivate: [AuthGuard]
  },{ 
    path: 'cardEditor', 
    component: CardEditorComponent,
    canActivate: [AuthGuard]
  },{ 
    path: 'users', 
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { 
      authRole: "ADMIN"
    }
  },{ 
    path: 'userEditor', 
    component: UserEditorComponent,
    canActivate: [AuthGuard],
    data: { 
      authRole: "ADMIN"
    }
  }
];

@NgModule({
  imports: [
    BrowserModule,
    ScrollDispatchModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    LibMaterialModule,
    HttpModule
  ],
  exports: [RouterModule],
  providers: [
    EventBusService,
    GameService,
    CardsService,
    UsersService,
    AuthenticationService,
    AuthGuard
  ],
  declarations: [
    LoginComponent,
    GoogleLoginButtonComponent,
    GameBoardComponent,
    CellComponent,
    ConsoleComponent,
    GameDocsComponent,
    CardsComponent,
    CardEditorComponent,
    UsersComponent,
    UserEditorComponent
  ],
  entryComponents: [
    GameBoardComponent,
    GameDocsComponent,
    CardsComponent,
    CardEditorComponent,
    UsersComponent,
    UserEditorComponent,
    LoginComponent
  ]
})
export class AppRoutingModule { }
