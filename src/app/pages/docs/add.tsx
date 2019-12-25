import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { addDoc } from 'app/services/docs';
import MarkDownEditor from 'app/components/MarkDownEditor';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { requestDocTypesData } from 'app/store/docTypes/actions';
import { connect } from 'react-redux';
import { DocType } from 'app/services/docTypes';

interface AddDocsPageState {
    form: any;
}

interface AddDocsPageParams {
    login: string;
}

interface DispatchProps {
    requestDocTypes(): void;
}

interface Props extends RouteComponentProps<AddDocsPageParams>, DispatchProps {
    docTypes: DocType[];
}

class AddDocPage extends React.Component<Props, AddDocsPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            form: { description: "" }
        }
    }

    componentDidMount() {
        this.props.requestDocTypes();
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps !== this.props && nextProps.docTypes.length > 0) {
            this.setState({
                form: { ...this.state.form, docTypeId: nextProps.docTypes[0].id }
            });
        }
    }

    handleEditorChange(text: any) {
        this.setState({ form: { ...this.state.form, description: text } });
    }

    handleChange(event: any) {
        let fieldName = event.target.name;
        let fleldVal = event.target.value;
        this.setState({ form: { ...this.state.form, [fieldName]: fleldVal } });
    }

    async onSubmit(even: any) {
        event!.preventDefault();

        const addedDoc = await addDoc(this.props.match.params.login, this.state.form);
        this.props.history.replace(`/organizations/${this.props.match.params.login}/doctypes/${addedDoc.id}`)
    }

    render() {
        return (
            <div>
                <h1>Add DocType</h1>
                <Form onSubmit={this.onSubmit.bind(this)}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Type</Form.Label>
                        <Form.Control name="docTypeId" onChange={this.handleChange.bind(this)} as="select">
                            {this.props.docTypes.map((docType: DocType) => {
                                return (<option key={docType.id} value={docType.id}>{docType.name}</option>)
                            })}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control name="subject" onChange={this.handleChange.bind(this)} type="subject" />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <MarkDownEditor value={this.state.form.description} onChange={this.handleEditorChange.bind(this)} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Add</Button>
                </Form>
            </div>
        );
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        organization: state.organizations.currentOrganization,
        docTypes: state.docTypes.docTypes
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestDocTypes: () => dispatch(requestDocTypesData()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDocPage as any);