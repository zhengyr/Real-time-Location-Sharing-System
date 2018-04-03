package com.amazonaws.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import com.amazonaws.entities.TabItem;

public interface TabRepository extends CrudRepository<TabItem, Integer> {

	TabItem findById(Integer tabId);

	List<TabItem> findAll(); 

}