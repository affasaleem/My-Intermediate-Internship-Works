import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    // Per the ticket, every task should load into the Backlog swimlane
    // regardless of whatever status is in the underlying data.
    const clients = this.getClients().map(client => ({ ...client, status: 'backlog' }));
    this.state = {
      clients: {
        backlog: clients,
        inProgress: [],
        complete: [],
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
    this.laneKeyToStatus = {
      backlog: 'backlog',
      inProgress: 'in-progress',
      complete: 'complete',
    };
    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount() {
    const containers = [
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ];
    this.drake = Dragula(containers);
    this.drake.on('drop', this.handleDrop);
  }

  componentWillUnmount() {
    if (this.drake) {
      this.drake.destroy();
    }
  }

  getLaneKeyForContainer(container) {
    if (container === this.swimlanes.backlog.current) return 'backlog';
    if (container === this.swimlanes.inProgress.current) return 'inProgress';
    if (container === this.swimlanes.complete.current) return 'complete';
    return null;
  }

  handleDrop(el, target, source, sibling) {
    const id = el.getAttribute('data-id');
    const sourceKey = this.getLaneKeyForContainer(source);
    const targetKey = this.getLaneKeyForContainer(target);

    // Dragula already moved the raw DOM node into place. We let React own
    // the DOM instead, so remove dragula's node and re-render from state.
    if (target && el.parentNode === target) {
      target.removeChild(el);
    }

    this.setState(prevState => {
      const clients = { ...prevState.clients };
      const sourceList = [...clients[sourceKey]];
      const cardIndex = sourceList.findIndex(client => client.id === id);
      if (cardIndex === -1) {
        return null;
      }
      const [card] = sourceList.splice(cardIndex, 1);
      const updatedCard = { ...card, status: this.laneKeyToStatus[targetKey] };

      const targetList = sourceKey === targetKey ? sourceList : [...clients[targetKey]];

      let insertIndex = targetList.length;
      if (sibling) {
        const siblingId = sibling.getAttribute('data-id');
        const siblingIndex = targetList.findIndex(client => client.id === siblingId);
        if (siblingIndex !== -1) {
          insertIndex = siblingIndex;
        }
      }
      targetList.splice(insertIndex, 0, updatedCard);

      clients[sourceKey] = sourceKey === targetKey ? targetList : sourceList;
      clients[targetKey] = targetList;

      return { clients };
    });
  }
  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref}/>
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
