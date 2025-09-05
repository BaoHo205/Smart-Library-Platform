import ActiveLoanCard from './ActiveLoanCard';
import PastLoanCard from './PastLoanCard';
import type { CheckoutItem } from '@/types/checkout.type';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MyLoan({ checkouts }: { checkouts: CheckoutItem[] }) {
  const activeCheckouts: CheckoutItem[] = checkouts.filter(
    checkout => !checkout.isReturned
  );

  const pastCheckouts: CheckoutItem[] = checkouts.filter(
    checkout => checkout.isReturned
  );

  // Precompute a set of active book IDs for a fast and type-safe lookup
  const activeBookIds = new Set(activeCheckouts.map(c => String(c.bookId)));

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">My Loans</h1>
      </div>
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Checkout</TabsTrigger>
          <TabsTrigger value="past">Past Checkout</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeCheckouts.length > 0 ? (
              activeCheckouts.map(checkout => (
                <ActiveLoanCard key={checkout.bookId} checkout={checkout} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-8">
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    No books checked out
                  </h3>
                  <p className="text-gray-500">
                    Browse our library to find books to check out.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pastCheckouts.length > 0 ? (
              pastCheckouts.map((checkout, key) => (
                <PastLoanCard
                  key={key}
                  checkout={checkout}
                  isBorrowing={activeBookIds.has(String(checkout.bookId))}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-8">
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    No past loans
                  </h3>
                  <p className="text-gray-500">
                    You have not returned any books yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
