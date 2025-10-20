import { gql } from '@apollo/client';

const query = gql`
    query dailyQuoteArtwork {
        quote{
            quote
            author
            urlArtwork
        }
    }
`

export default query;
