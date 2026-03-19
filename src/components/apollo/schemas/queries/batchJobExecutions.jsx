import { gql } from "@apollo/client";

const batchJobExecutionsQuery = gql`
  query BatchJobExecutions {
    batchJobExecutions {
      jobName
      jobExecutionId
      status
      startTime
      endTime
      exitStatus
    }
  }
`;

export default batchJobExecutionsQuery;
