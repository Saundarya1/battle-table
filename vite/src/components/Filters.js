import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const roles = ["Juggernaut", "Missile Boat", "Scout", "Sniper", "Brawler", "Skirmisher", "Striker", "None"];
const rules = ["Standard", "Advanced", "Introductory", "Experimental"];


function Filters({initialData, setTableData}) {

    const [selectedRole, setSelectedRole] = useState('');
    const [selectedRule, setSelectedRule] = useState('');
    const [mechName, setMechName] = useState('');
    const [minBV, setMinBV] = useState('');
    const [maxBV, setMaxBV] = useState('');
    const [minTons, setMinTons] = useState('');
    const [maxTons, setMaxTons] = useState('');

    //
    const [filteredDataByRole, setFilteredDataByRole] = useState(initialData);
    const [filteredDataByRule, setFilteredDataByRule] = useState(initialData);
    const [filteredDataByTons, setFilteredDataByTons] = useState(initialData);
    const [filteredDataByBV, setFilteredDataByBV] = useState(initialData);
    const [filteredDataByName, setFilteredDataByName] = useState(initialData);

    useEffect(() => {
        filterByRole(selectedRole);
    }, [selectedRole]);

    useEffect(() => {
        filterByRule(selectedRule);
    }, [selectedRule]);

    useEffect(() => {
        filterByName(mechName);
    }, [mechName]);

    useEffect(() => {
        filterByTons(minTons, maxTons);
    }, [minTons, maxTons]);

    useEffect(() => {
        filterByBV(minBV, maxBV);
    }, [minBV, maxBV]);

    //MAIN ////////

    useEffect(() => {
        const finalFilteredData = filteredDataByRole.filter((mech) =>
            filteredDataByRule.includes(mech)
        ).filter((mech) =>
            filteredDataByTons.includes(mech)
        ).filter((mech) =>
            filteredDataByBV.includes(mech)
        ).filter((mech) =>
            filteredDataByName.includes(mech)
        )
        setTableData(finalFilteredData);
    }, [filteredDataByRole, filteredDataByRule, filteredDataByName, filteredDataByTons, filteredDataByBV]);


    function filterByName(mechName) {
        if (mechName === '') {
            setFilteredDataByName(initialData);
        } else {
            const filteredData = initialData.filter((item) =>
                item.name.toLowerCase().includes(mechName.toLowerCase())
            );
            setFilteredDataByName(filteredData);
        }
    }

    function filterByRole(selectedRole) {
        if (selectedRole === '') {
            setFilteredDataByRole(initialData);
        } else {
            const filteredData = initialData.filter((item) => item.role === selectedRole);
            setFilteredDataByRole(filteredData);
        }
    }

    function filterByRule(selectedRule) {
        if (selectedRule === '') {
            setFilteredDataByRule(initialData);
        } else {
            const filteredData = initialData.filter((item) => item.rules === selectedRule);
            setFilteredDataByRule(filteredData);
        }
    }

    function filterByTons(min, max) {
        const filteredData = initialData.filter((mech) => {
            const tons = mech.tons;
            if (min && max) {
                return tons >= parseFloat(min) && tons <= parseFloat(max);
            } else if (min) {
                return tons >= parseFloat(min);
            } else if (max) {
                return tons <= parseFloat(max);
            }
            return true;
        });
        setFilteredDataByTons(filteredData);
    }

    function filterByBV(min, max) {
        const filteredData = initialData.filter((mech) => {
            const BV = mech.BV;
            if (min && max) {
                return BV >= parseFloat(min) && BV <= parseFloat(max);
            } else if (min) {
                return BV >= parseFloat(min);
            } else if (max) {
                return BV <= parseFloat(max);
            }
            return true;
        });
        setFilteredDataByBV(filteredData);
    }

    return (
        <Navbar className="justify-content-between">
            <Navbar.Brand>Filters:</Navbar.Brand>
            <Form inline>
                <Row>
                    <Col className='custom-search'>
                        <i class="bi bi-search"></i>
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Name"
                            onChange={(e) => {
                                setMechName(e.target.value);
                                filterByName(e.target.value);
                            }}
                        />
                    </Col>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Role
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {roles.map((role, index) =>
                                    <Dropdown.Item key={index} onClick={() => {
                                        setSelectedRole(role);
                                        filterByRole(role);
                                    }}>
                                        {role}
                                    </Dropdown.Item>
                                )}
                                <Dropdown.Divider />
                                <Dropdown.Item>
                                    <Button variant="success" onClick={() => {
                                        setSelectedRole('');
                                        filterByRole('');
                                    }}>Clear</Button>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Rules
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {rules.map((rule, index) =>
                                    <Dropdown.Item key={index} onClick={() => {
                                        setSelectedRule(rule);
                                        filterByRule(rule);
                                    }}>
                                        {rule}
                                    </Dropdown.Item>
                                )}
                                <Dropdown.Divider />
                                <Dropdown.Item>
                                    <Button variant="success" onClick={() => {
                                        setSelectedRule('');
                                        filterByRule('');
                                    }}>Clear</Button>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <Dropdown autoClose="outside">
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Tons
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>
                                    <input
                                        placeholder="Min"
                                        value={minTons}
                                        onChange={(e) => {
                                            setMinTons(e.target.value);
                                            filterByTons();
                                        }}
                                    />
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <input
                                        placeholder="Max"
                                        value={maxTons}
                                        onChange={(e) => {
                                            setMaxTons(e.target.value);
                                            filterByTons();
                                        }}
                                    />
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Button variant="success" onClick={() => {
                                    setMinTons('');
                                    setMaxTons('');
                                    filterByTons('');
                                }}>Clear</Button>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <Dropdown autoClose="outside">
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                BV
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>
                                    <input
                                        placeholder="Min"
                                        value={minBV}
                                        onChange={(e) => {
                                            setMinBV(e.target.value);
                                            filterByBV();
                                        }}
                                    />
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <input
                                        placeholder="Max"
                                        value={maxBV}
                                        onChange={(e) => {
                                            setMaxBV(e.target.value);
                                            filterByBV();
                                        }}
                                    />
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Button variant="success" onClick={() => {
                                    setMinBV('');
                                    setMaxBV('');
                                    filterByBV('');
                                }}>Clear</Button>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Form>
        </Navbar>
    )
}

export default Filters;