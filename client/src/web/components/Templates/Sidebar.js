import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { Helmet } from 'react-helmet';
import Member from '../../../containers/Member';
import Header from '../UI/Header';
import Footer from '../UI/Footer';
import { Sidebar } from '../UI/Sidebar';

const Template = ({ pageTitle, children }) => (
    <div>
        <Helmet>
            <title>{pageTitle}</title>
        </Helmet>

        <Member Layout={Header} />
        <div className="content">
            <div className="d-flex">
                <Sidebar />
                <div className="flex-grow-1">
                    <div className="content-container">
                        {children}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

Template.propTypes = {
    pageTitle: PropTypes.string,
    children: PropTypes.element.isRequired,
};

Template.defaultProps = {
    pageTitle: 'Espace',
};

export default Template;
