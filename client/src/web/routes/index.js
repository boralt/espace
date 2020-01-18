import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Templates
import TemplateNothing from '../components/Templates/Nothing';
import TemplateSidebar from '../components/Templates/Sidebar';

// Routes
import Home from '../components/Home';
import TrafficDis from '../components/Pages/Traffic-distribution';
import DataPricing from '../components/Pages/Data-pricing';
import AppGroup from '../components/Configuration/App-Group';
import Channel from '../components/Configuration/Channel';
import Provider from '../components/Configuration/Provider';
import ChartDemo from '../components/Pages/Chart-demo';
import ProviderConfig from '../components/Pages/Provider-configuration';
import ServiceProcurement from '../components/Pages/Service-procurement'; 
import ChannelDemo from '../components/Pages/channel-demo'; 
import Inventory from '../components/Pages/Inventory';
import eSim from '../components/Pages/eSim';

import Blockage from '../components/Reporting/Blockage'
import Performance from '../components/Reporting/Performance'
import SlaCredits from '../components/Reporting/SlaCredits'

import RecipesContainer from '../../containers/Recipes';
import RecipeListingComponent from '../components/Recipe/Listing';
import RecipeSingleComponent from '../components/Recipe/Single';

import SignUpContainer from '../../containers/SignUp';
import SignUpComponent from '../components/User/SignUp';

import LoginContainer from '../../containers/Login';
import LoginComponent from '../components/User/Login';

import ForgotPasswordContainer from '../../containers/ForgotPassword';
import ForgotPasswordComponent from '../components/User/ForgotPassword';

import UpdateProfileContainer from '../../containers/UpdateProfile';
import UpdateProfileComponent from '../components/User/UpdateProfile';

import ConfigurationsContainer from '../../containers/ConfigurationContainer';
import ConfigurationEditor from '../components/Configuration/ConfigurationEditor';

import Error from '../components/UI/Error';

const Index = () => (
    <Switch>
        <Route
            exact
            path="/"
            render={props => (
                <TemplateSidebar>
                    <Home {...props} />
                </TemplateSidebar>
            )}
        />
         <Route
            exact
            path="/trafficdistrib"
            render={props => (
                <TemplateSidebar>
                    <TrafficDis {...props} />
                </TemplateSidebar>
            )}
        />
        <Route
            exact
            path="/chartdemo"
            render={props => (
                <TemplateSidebar>
                    <ChartDemo {...props} />
                </TemplateSidebar>
            )}
        />
        <Route
            exact
            path="/performance"
            render={props => (
                <TemplateSidebar>
                    <Performance {...props} />
                </TemplateSidebar>
            )}
        />
        <Route
            exact
            path="/ProviderConfig"
            render={props => (
                <TemplateSidebar>
                    <ProviderConfig {...props} />
                </TemplateSidebar>
            )}
        />
        <Route
            exact
            path="/blockage"
            render={props => (
                <TemplateSidebar>
                    <Blockage {...props} />
                </TemplateSidebar>
            )}
        />
        <Route
            exact
            path="/slacredits"
            render={props => (
                <TemplateSidebar>
                    <SlaCredits {...props} />
                </TemplateSidebar>
            )}
        />

        <Route
            exact
            path="/procurement"
            render={props => (
                <TemplateSidebar>
                    { <ServiceProcurement {...props} />}
                </TemplateSidebar>
            )}
        />
        <Route
            exact
            path="/inventory"
            render={props => (
                <TemplateSidebar>
                    <Inventory {...props} />
                </TemplateSidebar>
            )}
        />
        <Route
            exact
            path="/eSim"
            render={props => (
                <TemplateSidebar>
                    <eSim {...props} />
                </TemplateSidebar>
            )}
        />

        <Route
            exact
            path="/data_pricing"
            render={props => (
                <TemplateSidebar>
                    <DataPricing {...props} />
                </TemplateSidebar>
            )}
        />
         <Route
            exact
            path="/appgroup"
            render={props => (
                <TemplateSidebar>
                    <AppGroup {...props} />
                </TemplateSidebar>
            )}
        />
         <Route
            exact
            path="/channel"
            render={props => (
                <TemplateSidebar>
                    <Channel {...props} />
                </TemplateSidebar>
            )}
        />

         <Route
            exact
            path="/provider"
            render={props => (
                <TemplateSidebar>
                    <Provider {...props} />
                </TemplateSidebar>
            )}
        />
        <Route
            path="/sign-up"
            render={props => (
                <TemplateNothing pageTitle="Sign Up">
                    <SignUpContainer {...props} Layout={SignUpComponent} />
                </TemplateNothing>
            )}
        />
        <Route
            path="/login"
            render={props => (
                <TemplateNothing pageTitle="Login">
                    <LoginContainer {...props} Layout={LoginComponent} />
                </TemplateNothing>
            )}
        />
        <Route
            path="/forgot-password"
            render={props => (
                <TemplateNothing pageTitle="Forgot Password">
                    <ForgotPasswordContainer {...props} Layout={ForgotPasswordComponent} />
                </TemplateNothing>
            )}
        />
        <Route
            path="/update-profile"
            render={props => (
                <TemplateSidebar pageTitle="Update Profile">
                    <UpdateProfileContainer {...props} Layout={UpdateProfileComponent} />
                </TemplateSidebar>
            )}
        />
        <Route
            path="/recipes"
            render={props => (
                <TemplateSidebar pageTitle="Recipes">
                    <RecipesContainer {...props} Layout={RecipeListingComponent} />
                </TemplateSidebar>
            )}
        />
        <Route
            path="/recipe/:id"
            render={props => (
                <TemplateSidebar pageTitle="Recipe View">
                    <RecipesContainer {...props} Layout={RecipeSingleComponent} />
                </TemplateSidebar>
            )}
        />
        <Route
            path="/configurations"
            render={props => (
                <TemplateSidebar pageTitle="Configurations">
                    <ConfigurationsContainer {...props} Layout={ConfigurationEditor} />
                </TemplateSidebar>
            )}
        />
         <Route
            path="/test-channel"
            render={props => (
                <TemplateSidebar pageTitle="Channel Data">
                    <ConfigurationsContainer {...props} Layout={ChannelDemo} />
                </TemplateSidebar>
            )}
        />
        <Route
            render={props => (
                <TemplateSidebar pageTitle="404 - Page not found">
                    <Error {...props} title="404" content="Sorry, the route you requested does not exist" />
                </TemplateSidebar>
            )}
        />
    </Switch>
);

export default Index;
