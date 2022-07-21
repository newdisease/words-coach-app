import { Table, Button, ButtonGroup } from 'react-bootstrap';
import { ArrowRepeat, Trash } from 'react-bootstrap-icons';


const DictionaryPage = () => {
    return (
        <>
            <Table className='mt-5' striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>en</th>
                        <th>uk</th>
                        <th>progress</th>
                        <th>
                            actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>boy</td>
                        <td>хлопець</td>
                        <td>1/3</td>
                        <td>
                            <ButtonGroup>
                                <Button size='sm' className="mx-1">
                                    <ArrowRepeat size={20} />
                                </Button>
                                <Button size='sm' className="mx-1">
                                    <Trash size={20} />
                                </Button>
                            </ButtonGroup>
                        </td>
                    </tr>
                    <tr>
                        <td>girl</td>
                        <td>дівчина</td>
                        <td>0/3</td>
                        <td>
                            <Button size='sm' className="mx-1">
                                <ArrowRepeat size={20} />
                            </Button>
                            <Button size='sm' className="mx-1">
                                <Trash size={20} />
                            </Button>
                        </td>
                    </tr>
                    <tr>
                        <td>mother</td>
                        <td>мама</td>
                        <td>2/3</td>
                        <td>
                            <Button size='sm' className="mx-1">
                                <ArrowRepeat size={20} />
                            </Button>
                            <Button size='sm' className="mx-1">
                                <Trash size={20} />
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Button className='mt-3' variant="primary" size="lg">
                Load more
            </Button>
        </>
    )
}

export default DictionaryPage;