import { gql } from "@apollo/client";

const getBatchJobsQuery = gql`
  query getBatchJobs($page: Int!, $size: Int!, $status: String) {
    getBatchJobs(page: $page, size: $size, status: $status) {
      content {
        id
        jobName
        status
        startTime
        endTime
        exitCode
      }
      totalElements
      totalPages
      pageNumber
      pageSize
    }
  }
`;

export default getBatchJobsQuery;
