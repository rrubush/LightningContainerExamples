import React from 'react';

import * as contactService from '../services/ContactService';

import {HomeHeader} from '../components/PageHeader';

import ContactList from './ContactList';
import NewContactWindow from './NewContactWindow';

export default React.createClass({

    getInitialState() {
        return {contacts: []};
    },

    componentDidMount() {
        contactService.findAll().then(contacts => {
            let filteredContacts = contactService.filterFoundContacts(contacts);
            this.setState({contacts:filteredContacts});
        });
    },

    sortHandler(sortOrder) {
        contactService.findAll(sortOrder).then(contacts => {
            let filteredContacts = contactService.filterFoundContacts(contacts);
            this.setState({sortOrder, contacts:filteredContacts});
        });
    },

    newHandler() {
        this.setState({addingContact: true});
    },

    deleteHandler(data) {
        contactService.deleteItem(data.contact_id).then(() => {
            contactService.findAll(this.state.sort).then(contacts => {
                let filteredContacts = contactService.filterFoundContacts(contacts);
                this.setState({contacts:filteredContacts});
            });
        });
    },

    editHandler(data) {
        window.location.hash = "#contact/" + data.contact_id + "/edit";
    },

    saveHandler(contact) {
        let filteredContact = contactService.filterContact(contact);
        contactService.createItem(filteredContact).then(() => {
            contactService.findAll().then(contacts => {
                let filteredContacts = contactService.filterFoundContacts(contacts);
                this.setState({addingContact: false, contacts:filteredContacts});
            });
        });
    },

    cancelHandler() {
        this.setState({addingContact: false});
    },

    render() {
        return (
            <div>
                <HomeHeader type="contacts"
                            title="My Contacts"
                            newLabel="New Contact"
                            actions={[{value:"new", label:"New Contact"}]}
                            itemCount={this.state.contacts.length}
                            viewOptions={[{value:"table", label:"Table", icon:"table"},{value:"tiles", label:"Tiles", icon:"location"}]}
                            sortOptions={[{value:"first_name", label:"First Name"},{value:"last_name", label:"Last Name"}]}
                            onNew={this.newHandler}
                            onSort={this.sortHandler}
                            onViewChange={this.viewChangeHandler}/>
                <ContactList contacts={this.state.contacts} onSort={this.sortHandler} onDelete={this.deleteHandler} onEdit={this.editHandler}/>
                {this.state.addingContact ?  <NewContactWindow onSave={this.saveHandler} onCancel={this.cancelHandler}/> : ""}
            </div>
        );
    }
});