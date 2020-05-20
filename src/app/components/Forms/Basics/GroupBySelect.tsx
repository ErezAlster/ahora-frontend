import * as React from 'react';
import Form from 'react-bootstrap/Form';

interface GroupBySelectState {
    value: string;
}

interface GroupBySelectStateProps {
    value?: string;
    onUpdate: (value: string) => void;
}

const groupOptions: { name: string, value: string }[] = [
    {
        name: "",
        value: ""
    }, {
        name: "Status",
        value: "status"
    },
    {
        name: "Type",
        value: "docType"
    }, {
        name: "Repository",
        value: "repo"
    },
    {
        name: "label",
        value: "label"
    },
    {
        name: "reporter",
        value: "reporter"
    },
    {
        name: "assignee",
        value: "assignee"
    },
    {
        name: "createdAt",
        value: "createdAt"
    },
    {
        name: "updatedAt",
        value: "updatedAt"
    }];


class GroupBySelect extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            value: this.props.value || ""
        };
    }


    handleChange(event: any) {
        this.setState({ value: event.target.value });
        this.props.onUpdate(event.target.value);

    }

    render() {
        return (
            <Form.Control value={this.state.value} onChange={this.handleChange.bind(this)} as="select">
                {groupOptions.map((groupOption) => <option key={groupOption.value} value={groupOption.value}>{groupOption.name}</option>)}
            </Form.Control>
        );
    }
}

export default GroupBySelect;