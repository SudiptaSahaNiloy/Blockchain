import React from 'react';
import "./Style/Header.css";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Component } from 'react';

class Header extends Component {
    state = {
        isOpen: false,
    }

    render() {
        const toggle = () => {
            this.setState({
                isOpen: !this.state.isOpen,
            })
        };

        return (
            <Navbar className="navbar-section" color="dark" dark expand="md" >
                <div className="navbar-section-brand">
                    <NavbarBrand style={{ fontSize: "30px", fontWeight: "bold", padding: "100px" }} href="/home">BLOCKCHAIN</NavbarBrand>
                </div>
                <NavbarToggler onClick={toggle} />
                <div style={{ width: "100%" }}>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/home">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/admin">Admin</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/login">Login</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </div>
            </Navbar>
        );
    }

}

export default Header;