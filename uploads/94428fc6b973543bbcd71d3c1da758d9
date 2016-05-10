--Write a method that returns all subsets of a set
allSubset :: [a] -> [[a]]
 -- empty set is always one of the subsets
allSubset [] = [] ++ [[]]
 -- for a set with one elements, all subsets are the set itself and empty set
allSubset [x] = [[x]] ++ [[]]
-- to get all subsets, insert the new element to all the previous subsets
-- plus all the old previous subsets
allSubset (x:xs) = insert x (allSubset xs) ++ allSubset xs
                   where
                     insert e [] = [[e]]
                     insert e [a] = [e:a] ++ [[e]]
                     insert e (a:as) = [e:a] ++ insert e as
