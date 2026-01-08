import { RefereeEngine } from './referee-engine.js';
import { APIComparator } from './comparators/api-comparator.js';
import { CloudServiceComparator } from './comparators/cloud-comparator.js';
import { TechStackComparator } from './comparators/tech-stack-comparator.js';

export class Referee {
  constructor() {
    this.engine = new RefereeEngine();
    this.apiComparator = new APIComparator();
    this.cloudComparator = new CloudServiceComparator();
    this.techStackComparator = new TechStackComparator();
  }

  async compareAPIs(apis, options = {}) {
    return this.apiComparator.compare(apis, options);
  }

  async compareCloudServices(services, options = {}) {
    return this.cloudComparator.compare(services, options);
  }

  async recommendTechStack(requirements) {
    return this.techStackComparator.recommend(requirements);
  }

  async compareOptions(options, criteria, constraints = {}) {
    return this.engine.compare(options, criteria, constraints);
  }
}

export default Referee;