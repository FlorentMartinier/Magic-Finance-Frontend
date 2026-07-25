import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CardDetailComponent } from './pages/card-detail/card-detail.component';
import { MyAlertsComponent } from './pages/my-alerts/my-alerts.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'cards/:scryfallId', component: CardDetailComponent },
    {
        path: 'my-alerts',
        component: MyAlertsComponent,
        title: 'Mes Alertes - MTG Finance'
    },
    { path: '**', redirectTo: '' },
];