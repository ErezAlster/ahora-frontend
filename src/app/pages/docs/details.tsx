import * as React from 'react';
import { Doc, getDoc, updateDoc, assignDoc } from 'app/services/docs';
import { RouteComponentProps } from 'react-router';
import { CommentListComponent } from 'app/components/Comments/List';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { requestStatusesData } from 'app/store/statuses/actions';
import { Status } from 'app/services/statuses';
import { Link } from 'react-router-dom';
import LabelsList from 'app/components/LabelsSelector/details';
import SelectUser from 'app/components/users/selectusers';
import { UserItem } from 'app/services/users';
import { DocType } from 'app/services/docTypes';
import { requestDocTypesData } from 'app/store/docTypes/actions';
import Table from 'react-bootstrap/Table';
import Moment from 'react-moment';
import DocWatchersComponent from 'app/components/DocWatchers';

interface DocsDetailsPageState {
    doc: Doc | null;
}

interface DocsDetailsPageParams {
    login: string;
    id: string;
}

interface injectedParams {
    statuses: Status[],
    docTypes: Map<number, DocType>,
    loading: boolean
}

interface DocDetailsPageProps extends RouteComponentProps<DocsDetailsPageParams>, injectedParams {

}

interface DispatchProps {
    requestStatusesData(): void;
    requestDocTypeData(): void;
}

interface AllProps extends DocDetailsPageProps, DispatchProps {

}



class DocsDetailsPage extends React.Component<AllProps, DocsDetailsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            doc: null
        }
    }

    async changeStatus(statusId: number) {
        const doc = { ...this.state.doc!, status: statusId };
        const updatedDoc = await updateDoc(this.props.match.params.login, doc.id, doc);
        this.setState({
            doc: updatedDoc
        });
    }

    async componentDidMount() {
        this.props.requestStatusesData();
        this.props.requestDocTypeData();
        const doc: Doc = await getDoc(this.props.match.params.login, parseInt(this.props.match.params.id));
        this.setState({ doc });
    }

    async onAssigneeSelect(user: UserItem) {
        const addedUserItem: UserItem = await assignDoc(this.props.match.params.login, parseInt(this.props.match.params.id), user.username);
        this.setState({
            doc: { ...this.state.doc!, assignee: addedUserItem },
        });
    }

    render() {
        const doc: Doc | null = this.state.doc;
        let docType: DocType | undefined;
        if (doc) {
            docType = this.props.docTypes.get(doc.docTypeId);

        }
        return (
            <Container fluid={true}>
                {doc &&
                    <>
                        <Row className="details">
                            <Col xs={12} md={8}>
                                <h1>{doc.subject}</h1>
                                <ButtonGroup>
                                    {this.props.statuses.map((status) => {
                                        return <Button key={status.id} onClick={() => { this.changeStatus(status.id!); }} variant={(status.id === doc.status) ? "primary" : "light"} >{status.name}</Button>
                                    })}
                                </ButtonGroup>
                                <Link to={`/organizations/${this.props.match.params.login}/doctypes/${doc.id}/edit`}><Button variant="warning" className="ml-4">Edit</Button></Link>

                                <div className="mt-2"><LabelsList defaultSelected={doc.labels}></LabelsList></div>

                                <p className="mt-4 markdown-body" dangerouslySetInnerHTML={{ __html: doc.htmlDescription }}></p>
                                <CommentListComponent docId={doc.id} login={this.props.match.params.login}></CommentListComponent>

                            </Col>
                            <Col xs={12} md={4}>
                                <h2>People</h2>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td>Assignee:</td>
                                            <td><SelectUser editMode={false} defaultSelected={doc.assignee && [doc.assignee]} onSelect={this.onAssigneeSelect.bind(this)}></SelectUser></td>
                                        </tr>
                                        {docType &&
                                            (<tr>
                                                <td>Type: </td>
                                                <td>{docType.name}</td>
                                            </tr>)}
                                    </tbody>
                                </Table>
                                <h2>Watchers</h2>
                                <DocWatchersComponent docId={doc.id} login={this.props.match.params.login}></DocWatchersComponent>
                                <h2 className="mt-3">Times</h2>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td>Created At:</td>
                                            <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.createdAt}></Moment></td>
                                        </tr>
                                        {doc.updatedAt &&
                                            (<tr>
                                                <td>updated At: </td>
                                                <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.updatedAt}></Moment></td>
                                            </tr>)}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </>
                }
            </Container>
        );
    };
}

const mapStateToProps = (state: ApplicationState): injectedParams => {
    return {
        docTypes: state.docTypes.mapById,
        statuses: state.statuses.statuses,
        loading: state.statuses.loading
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestStatusesData: () => dispatch(requestStatusesData()),
        requestDocTypeData: () => dispatch(requestDocTypesData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocsDetailsPage as any); 