import { gql } from "@apollo/client";

const triggerBatchJobMutation = gql`
  mutation TriggerBatchJob($jobName: String!) {
    triggerBatchJob(jobName: $jobName)
  }
`;

export default triggerBatchJobMutation;
