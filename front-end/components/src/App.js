import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import AppRoute from './AppRoute'
import MainLayout from './layouts/MainLayout'
import 'antd/dist/antd.css'
import './assets/styles/style.scss'
import { ConfigProvider } from 'antd'
import ruRU from 'antd/lib/locale-provider/ru_RU'

// Async components
const Home = lazy(() => import('./scenes/Home'));
const Page = lazy(() => import('./scenes/Page'));
const NotFound = lazy(() => import('./scenes/NotFound'));

const App = () => (
   <Router>
      <ConfigProvider locale={ruRU}>
         <Suspense fallback={null}>
            <Switch>
               <AppRoute layout={ MainLayout } path="/" component={Home} exact />
               <AppRoute layout={ MainLayout } path="/page" component={Page} exact />
               <AppRoute layout={ MainLayout } component={ NotFound } />
            </Switch>
         </Suspense>
      </ConfigProvider>
   </Router>
);

export default App
