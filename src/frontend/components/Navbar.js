import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import market from './marketplaceLogo.png'

const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar bg="dark" variant="dark" className="mb-4" style={{ fontFamily: 'Sans-Serif' }}>
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img src={market} width="40" height="40" className="d-inline-block align-top me-2" alt="NFT Marketplace logo" />
                    <span className="fs-5 fw-bold">DApp NFT Marketplace</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link as={Link} to="/" className="fw-bold px-4">Home</Nav.Link>
                        <Nav.Link as={Link} to="/create" className="fw-bold px-4">Create</Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items" className="fw-bold px-4">My Listed Items</Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases" className="fw-bold px-4">My Purchases</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-info" className="fw-bold">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>
                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-info" className="fw-bold">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation;