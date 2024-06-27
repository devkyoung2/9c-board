import type { NextPage, GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { getGraphQLSDK } from "../../../utils/mimirGraphQLClient";
import { getPlanetName, getNodeType } from "../../../utils/network";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const network_info = context.query.network as string;

  try {
    const sheetNames = (await getGraphQLSDK(
      getNodeType(network_info),
    ).GetSheetNames({
      planetName: getPlanetName(network_info),
    })).sheetNames;
    return { props: { sheetNames, } };
  } catch (error) {
    console.error("Error fetching sheet names:", error);
    return { props: { sheetNames: [] } };
  }
};

interface SheetsNamesPageProps {
  sheetNames: string[];
}

const TableSheetsPage: NextPage<SheetsNamesPageProps> = ({ sheetNames }) => {
  const router = useRouter();
  const { network } = router.query;

  return (
    <div className="flex gap-2 m-4 w-full flex-wrap">
      {sheetNames.map((v, index) => {
        return (
          <div key={`${v}-${index}`}>
            <Link href={`/${network}/tablesheet/${v}`}>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {v}
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default TableSheetsPage;
