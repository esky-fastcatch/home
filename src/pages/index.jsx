import Layout from "./Layout.jsx";

import Home from "./Home";

import MyReservations from "./MyReservations";

import RegularModify from "./RegularModify";

import RegularNew from "./RegularNew";

import CrematedNew from "./CrematedNew";

import AdminExport from "./AdminExport";

import CrematedModify from "./CrematedModify";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    MyReservations: MyReservations,
    
    RegularModify: RegularModify,
    
    RegularNew: RegularNew,
    
    CrematedNew: CrematedNew,
    
    AdminExport: AdminExport,
    
    CrematedModify: CrematedModify,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/MyReservations" element={<MyReservations />} />
                
                <Route path="/RegularModify" element={<RegularModify />} />
                
                <Route path="/RegularNew" element={<RegularNew />} />
                
                <Route path="/CrematedNew" element={<CrematedNew />} />
                
                <Route path="/AdminExport" element={<AdminExport />} />
                
                <Route path="/CrematedModify" element={<CrematedModify />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}