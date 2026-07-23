import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CardDetailComponent } from './pages/card-detail/card-detail.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'cards/:scryfallId', component: CardDetailComponent },
    { path: '**', redirectTo: '' }
];