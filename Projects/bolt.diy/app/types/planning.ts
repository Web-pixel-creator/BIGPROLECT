export type PlanningStatus = 'planning' | 'implementing' | 'complete';

export type PlanningStepStatus = 'todo' | 'in_progress' | 'complete' | 'blocked' | 'skipped';

export type PlanningStep = {
  id: string;
  title: string;
  description?: string;
  status: PlanningStepStatus;
  command?: string;
};

export type PlanningDesignConcept = {
  colors?: string;
  effects?: string;
  typography?: string;
  animations?: string;
};

export type PlanningBlock = {
  id?: string;
  version?: string;
  goal?: string;
  steps?: Array<PlanningStep | string>;
  inspiration?: string[];
  designConcept?: PlanningDesignConcept;
  features?: string[];
  techStack?: string[];
  status?: PlanningStatus;
};

